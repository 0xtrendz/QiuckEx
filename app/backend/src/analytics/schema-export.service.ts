import { Injectable } from '@nestjs/common';

/**
 * A single field definition within an analytics event schema.
 */
export interface SchemaFieldDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description?: string;
}

/**
 * A versioned analytics event schema.
 */
export interface EventSchema {
  eventName: string;
  version: number;
  fields: SchemaFieldDefinition[];
  description?: string;
}

/**
 * Minimal contract the export service depends on. The concrete registry
 * (SchemaRegistryService) is expected to provide the full set of registered
 * schemas so they can be serialized for external consumers.
 */
export interface SchemaRegistrySource {
  getAllSchemas(): EventSchema[];
}

/**
 * Shape of the exported registry document consumed by dashboards and other
 * downstream consumers.
 */
export interface ExportedSchemaRegistry {
  /** Schema of the export document itself, for consumer version negotiation. */
  registryVersion: number;
  /** ISO-8601 timestamp of when the export was generated. */
  generatedAt: string;
  /** Total number of exported event schemas. */
  eventCount: number;
  /** All registered event schemas, keyed by event name. */
  events: Record<string, EventSchema>;
}

/**
 * Exports the analytics event schema registry in a stable, machine-readable
 * form so that dashboards and consumers can read the declared schemas without
 * coupling to the internal registry implementation.
 */
@Injectable()
export class SchemaExportService {
  /** Version of the export envelope format (not the individual event schemas). */
  static readonly REGISTRY_VERSION = 1;

  constructor(private readonly registry: SchemaRegistrySource) {}

  /**
   * Build the full export document. Events are keyed by name; when multiple
   * versions of the same event exist, the highest version wins so consumers
   * always see the current declared schema.
   */
  export(): ExportedSchemaRegistry {
    const schemas = this.registry.getAllSchemas();
    const events: Record<string, EventSchema> = {};

    for (const schema of schemas) {
      const existing = events[schema.eventName];
      if (!existing || schema.version > existing.version) {
        events[schema.eventName] = schema;
      }
    }

    return {
      registryVersion: SchemaExportService.REGISTRY_VERSION,
      generatedAt: new Date().toISOString(),
      eventCount: Object.keys(events).length,
      events,
    };
  }

  /**
   * Serialize the export document to a JSON string suitable for writing to a
   * file, serving over HTTP, or publishing to a schema catalog.
   */
  exportAsJson(pretty = true): string {
    return JSON.stringify(this.export(), null, pretty ? 2 : 0);
  }
}
