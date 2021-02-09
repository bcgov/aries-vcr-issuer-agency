import { BadRequest } from '@feathersjs/errors';
import { HookContext, Service } from '@feathersjs/feathers';
import { SchemaServiceModel } from '../../models/schema';

export async function validateSchemaModel(
  context: HookContext
): Promise<HookContext<any, Service<any>>> {
  const data = (context.data || {}) as SchemaServiceModel;

  if (
    !data.schema_name ||
    !data.schema_version ||
    data.attributes.length === 0
  ) {
    throw new BadRequest(
      'Schema name, version and attribute list are mandatory properties.'
    );
  }

  if (data.metadata) {
    const metadata = data.metadata;
    if (metadata.topic.length === 0) {
      throw new BadRequest(
        'At least one topic must be specified in the schema metadata.'
      );
    }
    if (metadata.cardinality.length === 0) {
      throw new BadRequest(
        'At least one cardinality field mapping must be specified in the schema metadata.'
      );
    }
    if (
      metadata.date_fields.effective_date ||
      metadata.date_fields.revoked_date
    ) {
      throw new BadRequest(
        'Effective Date and Revoked Date field mappings must be provided in the schema metadata.'
      );
    }
  }

  return context;
}
