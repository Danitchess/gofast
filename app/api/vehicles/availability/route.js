import { sql, DB_CONFIGURED } from '@/lib/db';
import { VEHICLES, DEFAULT_UNITS_PER_VEHICLE } from '@/lib/vehicles';

export async function GET() {
  if (!DB_CONFIGURED) {
    return Response.json({
      demo: true,
      vehicles: VEHICLES.map((v) => ({ id: v.id, availableUnits: DEFAULT_UNITS_PER_VEHICLE, totalUnits: DEFAULT_UNITS_PER_VEHICLE })),
    });
  }

  try {
    const rows = await sql`select id, available_units, total_units from vehicles`;
    return Response.json({
      demo: false,
      vehicles: rows.map((r) => ({ id: r.id, availableUnits: r.available_units, totalUnits: r.total_units })),
    });
  } catch (err) {
    console.error('availability query failed', err);
    return Response.json({
      demo: true,
      vehicles: VEHICLES.map((v) => ({ id: v.id, availableUnits: DEFAULT_UNITS_PER_VEHICLE, totalUnits: DEFAULT_UNITS_PER_VEHICLE })),
    });
  }
}
