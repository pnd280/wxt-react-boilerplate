import type {
  MaybePromise,
  Message,
  RemoveListenerCallback,
  GetDataType,
  GetReturnType,
} from "@webext-core/messaging";

type GenericMessenger<
  TProtocolMap extends Record<string, unknown>,
  TMessageExtension,
  TSendMessageArgs extends readonly unknown[],
> = {
  sendMessage<TType extends keyof TProtocolMap>(
    type: TType,
    data: GetDataType<TProtocolMap[TType]>,
    ...args: TSendMessageArgs
  ): Promise<GetReturnType<TProtocolMap[TType]>>;
  onMessage<TType extends keyof TProtocolMap>(
    type: TType,
    onReceived: (
      message: Message<TProtocolMap, TType> & TMessageExtension,
    ) => void | MaybePromise<GetReturnType<TProtocolMap[TType]>>,
  ): RemoveListenerCallback;
  removeAllListeners(): void;
};

type ExtendedConfig = {
  timeout?: number;
  throwOnTimeout?: boolean;
};

type SuccessReturnData<
  TProtocolMap extends Record<string, unknown>,
  TType extends keyof TProtocolMap,
> = {
  success: true;
  data: GetReturnType<TProtocolMap[TType]>;
};

type ErrorReturnData = {
  success: false;
  error: Error;
};

type ExtendedReturnData<
  TProtocolMap extends Record<string, unknown>,
  TType extends keyof TProtocolMap,
> = SuccessReturnData<TProtocolMap, TType> | ErrorReturnData;

export default class ExtendedMessenger<
  TProtocolMap extends Record<string, unknown>,
> {
  constructor(
    private readonly messenger: GenericMessenger<TProtocolMap, unknown, []>,
  ) {}

  sendMessage<TType extends keyof TProtocolMap>(
    type: TType,
    data: GetDataType<TProtocolMap[TType]>,
  ): Promise<SuccessReturnData<TProtocolMap, TType>>;
  sendMessage<TType extends keyof TProtocolMap>(
    type: TType,
    data: GetDataType<TProtocolMap[TType]>,
    config: ExtendedConfig & { timeout: number },
  ): Promise<ExtendedReturnData<TProtocolMap, TType>>;
  async sendMessage<TType extends keyof TProtocolMap>(
    type: TType,
    data: GetDataType<TProtocolMap[TType]>,
    config: ExtendedConfig = {},
  ): Promise<ExtendedReturnData<TProtocolMap, TType>> {
    const { timeout, throwOnTimeout = false } = config;
    const messagePromise = this.createMessagePromise(type, data);

    if (timeout == null) {
      return messagePromise;
    }

    const timeoutPromise = this.createTimeoutPromise(timeout);
    const result = await Promise.race([messagePromise, timeoutPromise]);

    if (!result.success && throwOnTimeout) {
      throw result.error;
    }

    return result;
  }

  onMessage<TType extends keyof TProtocolMap>(
    type: TType,
    callback: (
      message: GetDataType<TProtocolMap[TType]>,
    ) =>
      | GetReturnType<TProtocolMap[TType]>
      | Promise<GetReturnType<TProtocolMap[TType]>>,
  ) {
    return this.messenger.onMessage(type, (message) => callback(message.data));
  }

  removeAllListeners() {
    this.messenger.removeAllListeners();
  }

  private createMessagePromise<TType extends keyof TProtocolMap>(
    type: TType,
    data: GetDataType<TProtocolMap[TType]>,
  ): Promise<SuccessReturnData<TProtocolMap, TType>> {
    return new Promise((resolve) => {
      this.messenger.sendMessage(type, data).then((data) => {
        resolve({
          success: true,
          data,
        });
      });
    });
  }

  private createTimeoutPromise(timeout: number): Promise<ErrorReturnData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: false,
          error: new Error(`Request timed out after ${timeout}ms`),
        });
      }, timeout);
    });
  }
}
