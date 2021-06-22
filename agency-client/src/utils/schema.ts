import {
  Metadata,
  MetadataTranslation,
  Translation,
  AddressMetadata as Address,
  Schema
} from '@/store/modules/schema';

export enum AttributeFieldType {
  TEXT = 1,
  NUMBER,
  DATE,
  ADDRESS
}

export enum DateFieldType {
  EFFECTIVE = 1,
  REVOKED,
  OTHER
}

export interface Topic {
  mapped: boolean;
  schema: string;
}

export interface Attribute {
  id: Readonly<number>;
  name: string;
  type: AttributeFieldType | null;
  cardinal: boolean;
  search: boolean;
  topic: Topic | null;
  dateType?: DateFieldType | null;
  localizedLabels?: Record<string, Translation>;
  address?: Address | null;
  value?: string | Date;
}

export function formatSchemaAttributes (schema: Schema | null | undefined): Attribute[] {
  if (!schema) {
    return [];
  }
  return formatAttributes(schema.metadata, schema.attributes);
}

export function formatSchemaLocalizedLabels (schema: Schema | null | undefined): Record<string, Translation> {
  const labels = schema?.metadata?.labels?.schema;
  if (!(schema && labels)) {
    return {};
  }
  return formatLocalizedLabels(labels);
}

export function formatAttributes (metadata: Metadata, attributes: string[]): Attribute[] {
  return attributes.map((attribute: string, idx: number) => {
    const labels =
      metadata?.labels?.attributes.find(
        (label) => label.name === attribute
      ) || {};

    const dataType = formatDataType(metadata, attribute);

    return {
      id: idx + 1,
      name: attribute,
      type: dataType.type,
      dateType: dataType?.subtype || null,
      cardinal: formatCardinality(metadata, attribute),
      search: formatSearchability(metadata, attribute),
      topic: formatTopic(metadata, attribute),
      localizedLabels: formatLocalizedLabels(labels)
    };
  });
}

export function formatSearchability (metadata: Metadata, attribute: string): boolean {
  return metadata?.search_fields.indexOf(attribute) >= 0;
}

export function formatCardinality (metadata: Metadata, attribute: string): boolean {
  return metadata?.cardinality.indexOf(attribute) >= 0;
}

export function formatTopic (metadata: Metadata, attribute: string): Topic {
  const topic = { mapped: false, schema: '' };
  const mappedTopic = metadata.topic.find((t) => t.name === attribute);
  if (mappedTopic) {
    topic.mapped = true;
    topic.schema = mappedTopic.topic_type || '';
  }
  return topic;
}

export function formatLocalizedLabels (
  labels: MetadataTranslation | Record<string, string>
): Record<string, Translation> {
  const entries = Object.entries(labels?.translations || labels || {});
  return entries.reduce((acc, entry) => {
    const [key, value] = entry;
    const translation = {
      label: value?.label || value || '',
      description: value?.description || ''
    };
    return { ...acc, [key]: translation };
  }, {});
}

export function formatDataType (
  metadata: Metadata,
  attribute: string
): { type: AttributeFieldType, subtype?: DateFieldType } {
  // TODO: Update this when the Address fields are resolved
  const type = { type: AttributeFieldType.TEXT };
  if (metadata?.date_fields?.effective_date === attribute) {
    return { type: AttributeFieldType.DATE, subtype: DateFieldType.EFFECTIVE };
  } else if (metadata?.date_fields?.revoked_date === attribute) {
    return { type: AttributeFieldType.DATE, subtype: DateFieldType.REVOKED };
  } else if (metadata?.date_fields?.other_date_fields.indexOf(attribute) >= 0) {
    return { type: AttributeFieldType.DATE, subtype: DateFieldType.OTHER };
  }
  return type;
}
