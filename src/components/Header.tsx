import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { HeaderLogo } from "./svgIcons";

export default function Header(props: { totalBurned: number, connected: boolean }) {
    return (
        <header className="header">
            <div className="header-content container">
                <div className="header-left">
                    <Link href="/">
                        <a>
                            <HeaderLogo />
                        </a>
                    </Link>
                </div>
                <div className="header-right">
                    {props.connected &&
                        <div className="total-burned">
                            {/* eslint-disable-next-line */}
                            <img
                                src="/img/fire.png"
                                alt=""
                            />
                            <span>{props.totalBurned}</span>
                            {/* eslint-disable-next-line */}
                            <img
                                src="/img/fire.png"
                                alt=""
                            />
                        </div>
                    }
                    <WalletModalProvider>
                        <WalletMultiButton />
                    </WalletModalProvider>
                </div>
            </div>
        </header>
    )
}