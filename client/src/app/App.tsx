import React, { Component, ReactNode } from "react";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import { ServiceFactory } from "../factories/serviceFactory";
import { PaletteHelper } from "../helpers/paletteHelper";
import { NetworkService } from "../services/networkService";
import "./App.scss";
import { AppRouteProps } from "./AppRouteProps";
import { AppState } from "./AppState";
import Disclaimer from "./components/Disclaimer";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SearchInput from "./components/SearchInput";
import Addr from "./routes/chrysalis/Addr";
import { AddrRouteProps } from "./routes/chrysalis/AddrRouteProps";
import Indexed from "./routes/chrysalis/Indexed";
import { IndexedRouteProps } from "./routes/chrysalis/IndexedRouteProps";
import Message from "./routes/chrysalis/Message";
import { MessageRouteProps } from "./routes/chrysalis/MessageRouteProps";
import Milestone from "./routes/chrysalis/Milestone";
import { MilestoneRouteProps } from "./routes/chrysalis/MilestoneRouteProps";
import CurrencyConverter from "./routes/CurrencyConverter";
import Landing from "./routes/Landing";
import { LandingRouteProps } from "./routes/LandingRouteProps";
import Markets from "./routes/Markets";
import Address from "./routes/og/Address";
import { AddressRouteProps } from "./routes/og/AddressRouteProps";
import Bundle from "./routes/og/Bundle";
import { BundleRouteProps } from "./routes/og/BundleRouteProps";
import Tag from "./routes/og/Tag";
import { TagRouteProps } from "./routes/og/TagRouteProps";
import Transaction from "./routes/og/Transaction";
import { TransactionRouteProps } from "./routes/og/TransactionRouteProps";
import Search from "./routes/Search";
import { SearchRouteProps } from "./routes/SearchRouteProps";
import StreamsV0 from "./routes/StreamsV0";
import { StreamsV0RouteProps } from "./routes/StreamsV0RouteProps";
import Visualizer from "./routes/Visualizer";
import { VisualizerRouteProps } from "./routes/VisualizerRouteProps";


/**
 * Main application class.
 */
class App extends Component<RouteComponentProps<AppRouteProps>, AppState> {
    /**
     * The network service.
     */
    private readonly _networkService: NetworkService;

    /**
     * Create a new instance of App.
     * @param props The props.
     */
    constructor(props: RouteComponentProps<AppRouteProps>) {
        super(props);
        this._networkService = ServiceFactory.get<NetworkService>("network");
        const networks = this._networkService.networks();

        this.state = {
            networkId: "",
            networks
        };
    }

    /**
     * The component mounted.
     */
    public componentDidMount(): void {
        this.setNetwork(this.props.match.params.network, true);
    }

    /**
     * The component updated.
     */
    public componentDidUpdate(): void {
        this.setNetwork(this.props.match.params.network, false);
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        const currentNetworkConfig = this.state.networks.find(n => n.network === this.state.networkId);

        return (
            <div className="app">
                <Header
                    rootPath={`/${currentNetworkConfig?.isEnabled
                        ? this.state.networkId
                        : ""}`}
                    network={currentNetworkConfig}
                    networks={this.state.networks}
                    action={this.props.match.params.action}
                    history={this.props.history}
                    search={
                        <SearchInput
                            onSearch={query => this.setQuery(query)}
                            compact={true}
                            protocolVersion={currentNetworkConfig?.protocolVersion ?? "og"}
                        />
                    }
                    pages={this.state.networks.length > 0 ? [
                        {
                            label: "Explorer",
                            url: `/${this.state.networkId}/`
                        },
                        {
                            label: "Visualizer",
                            url: `/${this.state.networkId}/visualizer/`
                        }
                    ] : []}
                    utilities={this.state.networks.length > 0 ? [
                        {
                            label: "Streams v0",
                            url: `/${this.state.networkId}/streams/0/`
                        },
                        {
                            label: "Markets",
                            url: `/${this.state.networkId}/markets/`
                        },
                        {
                            label: "Currency Converter",
                            url: `/${this.state.networkId}/currency-converter/`
                        }
                    ] : []}
                />
                <div className="content">
                    {this.state.networks.length > 0
                        ? (
                            <React.Fragment>
                                {this.props.match.params.network &&
                                    !this.state.networks.some(f => f.network === this.props.match.params.network) && (
                                        <div className="maintenance">
                                            <div className="maintenance-inner">
                                                The network provided does not exist, please check the url.
                                            </div>
                                        </div>
                                    )}
                                {this.props.match.params.network &&
                                    this.state.networks.some(f => f.network === this.props.match.params.network) && (
                                        <Switch>
                                            <Route
                                                path="/:network/markets"
                                                component={() =>
                                                (
                                                    <Markets />
                                                )}
                                            />
                                            <Route
                                                path="/:network/currency-converter"
                                                component={() =>
                                                (
                                                    <CurrencyConverter />
                                                )}
                                            />
                                            <Route
                                                exact={true}
                                                path="/:network?"
                                                component={(props: RouteComponentProps<LandingRouteProps>) =>
                                                (
                                                    <Landing
                                                        {...props}
                                                        switcher={<p>In progress...</p>}
                                                        search={(
                                                            <SearchInput
                                                                onSearch={query => this.setQuery(query)}
                                                                compact={false}
                                                                protocolVersion={
                                                                    currentNetworkConfig?.protocolVersion ??
                                                                    "og"
                                                                }
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                            <Route
                                                path="/:network/streams/0/:hash?/:mode?/:key?"
                                                component={(props: RouteComponentProps<StreamsV0RouteProps>) =>
                                                (
                                                    <StreamsV0 {...props} />
                                                )}
                                            />
                                            <Route
                                                path="/:network/visualizer/"
                                                component={(props: RouteComponentProps<VisualizerRouteProps>) =>
                                                (
                                                    <Visualizer {...props} />
                                                )}
                                            />
                                            <Route
                                                path="/:network/transaction/:hash"
                                                component={(props: RouteComponentProps<TransactionRouteProps>) =>
                                                (
                                                    <Transaction {...props} />
                                                )}
                                            />
                                            <Route
                                                path="/:network/tag/:hash"
                                                component={(props: RouteComponentProps<TagRouteProps>) =>
                                                (
                                                    <Tag {...props} />
                                                )}
                                            />
                                            <Route
                                                path="/:network/address/:hash"
                                                component={(props: RouteComponentProps<AddressRouteProps>) =>
                                                (
                                                    <Address
                                                        {...props}
                                                    />
                                                )}
                                            />
                                            <Route
                                                path="/:network/bundle/:hash"
                                                component={(props: RouteComponentProps<BundleRouteProps>) =>
                                                (
                                                    <Bundle {...props} />
                                                )}
                                            />
                                            <Route
                                                path="/:network/search/:query?"
                                                component={(props: RouteComponentProps<SearchRouteProps>) =>
                                                (
                                                    <Search {...props} />
                                                )}
                                            />
                                            <Route
                                                path="/:network/addr/:address"
                                                component={(props: RouteComponentProps<AddrRouteProps>) =>
                                                (
                                                    <Addr
                                                        {...props}
                                                    />
                                                )}
                                            />
                                            <Route
                                                path="/:network/milestone/:milestoneIndex"
                                                component={(props: RouteComponentProps<MilestoneRouteProps>) =>
                                                (
                                                    <Milestone
                                                        {...props}
                                                    />
                                                )}
                                            />
                                            <Route
                                                path="/:network/message/:messageId"
                                                component={(props: RouteComponentProps<MessageRouteProps>) =>
                                                (
                                                    <Message
                                                        {...props}
                                                    />
                                                )}
                                            />
                                            <Route
                                                path="/:network/indexed/:index"
                                                component={(props: RouteComponentProps<IndexedRouteProps>) =>
                                                (
                                                    <Indexed
                                                        {...props}
                                                    />
                                                )}
                                            />
                                        </Switch>
                                    )}
                            </React.Fragment>
                        )
                        : (
                            <div className="maintenance">
                                <div className="maintenance-inner">
                                    Explorer is currently undergoing maintenance, please check back later.
                                </div>
                            </div>
                        )}
                </div>
                <Footer
                    dynamic={
                        this.state.networks.length > 0 ? this.state.networks
                            .filter(network => network.isEnabled)
                            .map(n => ({
                                label: n.label,
                                url: n.network
                            }))
                            .concat({
                                label: "Streams v0",
                                url: `${this.state.networkId}/streams/0/`
                            })
                            .concat({
                                label: "Visualizer",
                                url: `${this.state.networkId}/visualizer/`
                            })
                            .concat({
                                label: "Markets",
                                url: `${this.state.networkId}/markets/`
                            })
                            .concat({
                                label: "Currency Converter",
                                url: `${this.state.networkId}/currency-converter/`
                            }) : [
                            {
                                label: "Maintenance Mode",
                                url: ""
                            }
                        ]
                    }
                />
                <Disclaimer />
            </div>
        );
    }

    /**
     * Set the active network
     * @param network The network to set.
     * @param updateLocation Update the location as well.
     */
    private setNetwork(network: string | undefined, updateLocation: boolean): void {
        if (!network) {
            network = this.state.networks && this.state.networks.length > 0
                ? this.state.networks[0].network : "mainnet";
            updateLocation = true;
        }
        const hasChanged = network !== this.state.networkId;
        if (hasChanged) {
            this.setState(
                {
                    networkId: network ?? ""
                },
                () => {
                    const config = this.state.networks.find(n => n.network === network);
                    if (config?.primaryColor && config.secondaryColor) {
                        PaletteHelper.setPalette(config.primaryColor, config.secondaryColor);
                    }
                    if (!this.props.location.pathname.startsWith(`/${network}`) && updateLocation) {
                        this.props.history.replace(`/${network}`);
                    }
                    window.scrollTo({
                        left: 0,
                        top: 0,
                        behavior: "smooth"
                    });
                }
            );
        }
    }

    /**
     * Set the search query
     * @param query The search query to set.
     */
    private setQuery(query?: string): void {
        this.props.history.push(`/${this.state.networkId}/search/${query}`);
    }
}

export default withRouter(App);
