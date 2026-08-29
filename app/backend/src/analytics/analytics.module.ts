import { Module } from '@nestjs/common';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { EventSchemaRegistry } from './schema/event-schema.registry';
import { EventValidationService } from './schema/event-validation.service';

@Module({
  imports: [SupabaseModule, ApiKeysModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, EventSchemaRegistry, EventValidationService],
  exports: [AnalyticsService, EventSchemaRegistry, EventValidationService],
})
export class AnalyticsModule {}
