import { Centrifuge } from "centrifuge";
import SockJS from "sockjs-client";


interface IConnectProps {
    userId: number
    centrifugeToken?: string
    centrifugeUrl?: string
}


export const connectToCentrifuge = (dataset: IConnectProps) => {
    const { userId, centrifugeToken, centrifugeUrl } = dataset || {};

    if (!userId) {
        console.debug("No userId passed to centrifuge");
        return null;
    }

    if (!centrifugeToken) {
        console.debug("No centrifugeToken passed to centrifuge");
        return null;
    }

    if (!centrifugeUrl) {
        console.debug("No centrifugeUrl passed to centrifuge");
        return null;
    }

    const centrifuge = new Centrifuge(centrifugeUrl, {
        sockjs: SockJS,
        refreshEndpoint: "/centrifuge/refresh/",
        refreshHeaders: { "X-CSRFToken": csrfToken },
        subscribeEndpoint: "/centrifuge/subscribe/",
        subscribeHeaders: { "X-CSRFToken": csrfToken },
        onTransportClose: (context) => {
            console.info("Transport was closed: ", context);
        },
    });

    centrifuge.setToken(centrifugeToken);

    centrifuge.on('connect', (context) => {
        console.info('Connected to centrifuge: ', context);
    });

    centrifuge.on('disconnect', (context) => {
        console.info('Disconnected from centrifuge: ', context);
    });

    centrifuge.on('error', (error) => {
        console.error('Error from centrifuge:', error);
    });

    centrifuge.subscribePublish = subscribePublish;
    centrifuge.connect();

    return centrifuge;
}

export type { IConnectProps };
