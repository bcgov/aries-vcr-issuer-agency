import { IssuerProfileModel } from '../models/issuer-model';
import {
  AddressMapping,
  AddressMetadata,
  AttributeMapping,
  CredentialMetadata,
  CredentialTypePayload,
  IssuerPayload,
  IssuerRegistrationPayload,
  ModelMapping,
  NameMapping,
  SchemaAttributeTranslation,
  SchemaTopic,
  TopicMapping,
} from '../models/issuer-registration';
import { SchemaServiceModel } from '../models/schema';

export function formatIssuerRegistrationRequest(
  profile: IssuerProfileModel,
  schema: SchemaServiceModel
): IssuerRegistrationPayload {
  const issuerPayload = formatIssuerPayload(profile);
  const credentialPayload = formatCredentialTypePayload(profile, schema);
  return {
    connection_id: profile.vcr.connection_id,
    issuer_registration: {
      issuer: issuerPayload,
      credential_types: [credentialPayload],
    },
  } as IssuerRegistrationPayload;
}

function formatIssuerPayload(profile: IssuerProfileModel): IssuerPayload {
  return {
    name: profile.name,
    did: profile.did,
    email: profile.email,
    logo_b64: profile.logo,
    abbreviation: profile.abbreviation,
    url: profile.url,
    // TODO: handle following items
    abbreviations: {},
    labels: {},
    urls: {},
  };
}

function formatCredentialTypePayload(
  profile: IssuerProfileModel,
  schema: SchemaServiceModel
): CredentialTypePayload {
  return {
    schema: schema.schema_name,
    version: schema.schema_version,
    credential_def_id: schema.credential_definition_id,
    name: schema.schema_name,
    logo_b64: profile.logo,
    topic: formatTopicMappings(schema.metadata.topic),
    labels: schema.metadata.labels.schema,
    highlighted_attributes: schema.metadata.highlighted_attributes,
    credential_title: schema.metadata.credential_title,
    credential: {
      effective_date: {
        input: schema.metadata.date_fields.effective_date,
        from: 'claim',
      },
      revoked_date: {
        input: schema.metadata.date_fields.revoked_date,
        from: 'claim',
      },
    },
    claim_labels: formatClaimTranslations(
      TranslationType.Label,
      schema.metadata.labels.attributes
    ),
    claim_descriptions: formatClaimTranslations(
      TranslationType.Description,
      schema.metadata.labels.attributes
    ),
    mapping: formatAttributeMappings(schema.attributes, schema.metadata),
  } as CredentialTypePayload;
}

enum TranslationType {
  Label = 'label',
  Description = 'description',
}

function formatClaimTranslations(
  type: TranslationType,
  attributes: SchemaAttributeTranslation[]
): Record<string, unknown> {
  const labels: Record<string, unknown> = {};

  for (const attribute of attributes) {
    const name = attribute.name;
    const label: Record<string, string> = {};
    for (const language in attribute.translations) {
      label[language] = attribute.translations[language][type];
    }
    labels[name] = label;
  }

  return labels;
}

function isDateField(
  fieldName: string,
  dateFields: {
    effective_date: string;
    revoked_date: string;
    other_date_fields: string[];
  }
): boolean {
  return (
    fieldName === dateFields.effective_date ||
    fieldName === dateFields.revoked_date ||
    dateFields.other_date_fields.includes(fieldName)
  );
}

function isAddressField(
  fieldName: string,
  addressMappings: AddressMetadata[]
): boolean {
  for (const addressMapping of addressMappings) {
    if (
      fieldName === addressMapping.addressee ||
      fieldName === addressMapping.civic_address ||
      fieldName === addressMapping.city ||
      fieldName === addressMapping.province ||
      fieldName === addressMapping.postal_code ||
      fieldName === addressMapping.country
    ) {
      return true;
    }
  }
  return false;
}

function isStandardAttribute(
  attribute: string,
  metadata: CredentialMetadata
): boolean {
  return !isAddressField(attribute, metadata.address_fields);
}

function formatTopicMappings(topics: SchemaTopic[]): TopicMapping[] {
  const mappings = [] as TopicMapping[];

  for (const topic of topics) {
    mappings.push({
      source_id: {
        input: topic.name,
        from: 'claim',
      },
      type: {
        input: topic.topic_type,
        from: 'value',
      },
    });
  }

  return mappings;
}

function formatAttributeMappings(
  attributes: string[],
  metadata: CredentialMetadata
): ModelMapping[] {
  const mappings = [] as ModelMapping[];

  const baseAttributeMapping = (attribute: string) =>
    ({
      model: '',
      fields: {
        type: {
          input: attribute,
          from: 'value',
        },
      },
    } as ModelMapping);

  const standardAttributes = attributes.filter((attribute: string) => {
    return isStandardAttribute(attribute, metadata);
  });

  const searchAttributes = standardAttributes.filter((attribute: string) => {
    return metadata.search_fields.includes(attribute);
  });

  // prepare standard/date attributes mappings
  for (const attribute of standardAttributes) {
    const mapping = baseAttributeMapping(attribute) as AttributeMapping;
    mapping.model = 'attribute';
    mapping.fields.value = {
      input: attribute,
      from: 'claim',
    };

    if (isDateField(attribute, metadata.date_fields)) {
      mapping.fields.format = {
        input: 'datetime',
        from: 'value',
      };
    }

    mappings.push(mapping);
  }

  // prepare name/search mappings
  for (const attribute of searchAttributes) {
    const mapping = baseAttributeMapping(attribute) as NameMapping;
    mapping.model = 'name';
    mapping.fields.text = {
      input: attribute,
      from: 'claim',
    };

    mappings.push(mapping);
  }

  //prepare address mappings
  for (const addressMapping of metadata.address_fields) {
    const mapping = {
      model: 'address',
      fields: {
        addressee: {
          input: addressMapping.addressee,
          from: 'claim',
        },
        civic_address: {
          input: addressMapping.civic_address,
          from: 'claim',
        },
        city: {
          input: addressMapping.city,
          from: 'claim',
        },
        province: {
          input: addressMapping.province,
          from: 'claim',
        },
        postal_code: {
          input: addressMapping.postal_code,
          from: 'claim',
        },
        country: {
          input: addressMapping.country,
          from: 'claim',
        },
      },
    } as AddressMapping;

    mappings.push(mapping);
  }

  return mappings;
}
