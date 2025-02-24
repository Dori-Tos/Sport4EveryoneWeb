import type { APIEvent } from '@solidjs/start/server';
import { removeSportField } from '~/lib/sportFields';

export async function DELETE(event: APIEvent) {
    const id = Number(event.params.id);
    if (isNaN(id)) {
      return new Response(
        JSON.stringify({ message: `Invalid ID: ${event.params.id}` }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    try {
      await removeSportField(id);
      return new Response(
        JSON.stringify({ message: "Sport field deleted" }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
      );
    } catch (error: any) {
      return new Response(
        JSON.stringify({
          message: "Failed to delete sport field",
          error: error.message || String(error),
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      );
    }
  }