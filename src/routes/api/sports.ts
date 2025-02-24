import type { APIEvent } from '@solidjs/start/server';
import { addSport, getSports, removeSport } from '~/lib/sports';

export async function GET(event: APIEvent) {
  try {
    const sports = await getSports();
    return new Response(JSON.stringify(sports), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: "Failed to fetch sports",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

export async function POST(event: APIEvent) {
  try {
    const formData = await event.request.formData();
    const newSport = await addSport(formData);
    return new Response(JSON.stringify(newSport), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: "Failed to add sport",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

export async function DELETE(event: APIEvent) {
  const id = Number(event.params.id);
  if (isNaN(id)) {
    return new Response(
      JSON.stringify({ message: "Invalid ID" }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    );
  }
  try {
    await removeSport(id);
    return new Response(
      JSON.stringify({ message: "Sport deleted" }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: "Failed to delete sport",
        error: error.message || String(error),
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}