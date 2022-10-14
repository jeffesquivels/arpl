import {RpcCommand} from '../../lib/rpc-command'
import {Socket} from '../../lib/rpc'

import type {AppliedBlockLog, RevertedBlockLog} from '../../lib/server-types'

export default class AccountFollow extends RpcCommand {
  static description = 'Stream account events live'

  static args = [{
    name: 'address',
    description: 'Address of the account to follow',
    required: true,
  }]

  async run() {
    const {args, flags} = this.parse(AccountFollow)

    // Throws when not in REPL
    const {data: subscriptionId, metadata} = await this.call<number>(
      AccountFollow,
      'subscribeForLogsByAddressesAndTypes',
      [[args.address], []],
    )
    this.log('Subscribed to account events')
    this.showMetadataIfRequested(metadata, flags);

    (this.$rpc as Socket).onSubscription<AppliedBlockLog | RevertedBlockLog>(
      'subscribeForLogsByAddressesAndTypes',
      subscriptionId,
      ({data: blockLog, metadata}) => {
        console.dir(blockLog, {depth: Infinity}) // eslint-disable-line no-console
        this.showMetadataIfRequested(metadata, flags, 'Account subscription')
      },
    )
  }
}
