import { mount } from 'svelte';

import { connectToCentrifuge, type IConnectProps } from './connector';
import CentrifugeConnector from '$blocks/centrifuge-connector/index.svelte';


const target = document.getElementById('centrifuge-root');

if (target) {
    const { userId, centrifugeToken, centrifugeUrl } = target.dataset;

    const centrifuge = connectToCentrifuge({ userId, centrifugeToken, centrifugeUrl } as unknown as IConnectProps);
    mount(CentrifugeConnector, { target, props: { userId, centrifuge } });
}
