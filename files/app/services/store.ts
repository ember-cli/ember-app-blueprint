import { Fetch, RequestManager, Store } from '@warp-drive/core';
import {
  instantiateRecord,
  registerDerivations,
  SchemaService,
  teardownRecord,
} from '@warp-drive/core/reactive';
import { CacheHandler, CachePolicy } from '@warp-drive/core/store';
import type {
  CacheCapabilitiesManager,
  ResourceKey,
} from '@warp-drive/core/types';
import { JSONAPICache } from '@warp-drive/json-api';

export default class AppStore extends Store {
  requestManager = new RequestManager().use([Fetch]).useCache(CacheHandler);

  lifetimes = new CachePolicy({
    apiHardExpires: 15 * 60 * 1000, // 15 minutes
    apiSoftExpires: 1 * 30 * 1000, // 30 seconds
    constraints: {
      'X-WarpDrive-Expires': true,
      'Cache-Control': true,
      Expires: true,
    },
  });

  createSchemaService() {
    const schema = new SchemaService();
    registerDerivations(schema);
    return schema;
  }

  createCache(capabilities: CacheCapabilitiesManager) {
    return new JSONAPICache(capabilities);
  }

  instantiateRecord(
    identifier: ResourceKey,
    createArgs?: Record<string, unknown>
  ) {
    return instantiateRecord(this, identifier, createArgs);
  }

  teardownRecord(record: unknown): void {
    return teardownRecord(record);
  }
}
