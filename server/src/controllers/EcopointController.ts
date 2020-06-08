import knex from "./../database/connection";
import { Request, Response } from "express";

class EcopointController {
  async index(request: Request, response: Response) {
    const { cidade, uf, items } = request.query;

    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const ecopoints = await knex("ecopoints")
      .join("ecopoint_items", "ecopoints.id", "=", "ecopoint_items.ecopoint_id")
      .whereIn("ecopoint_items.item_id", parsedItems)
      .where("city", String(cidade))
      .where("uf", String(uf))
      .distinct()
      .select("ecopoints.*");

    const serializedEcopoints = ecopoints.map((ecopoint) => {
      return {
        ...ecopoint,
        image_url: `http://192.168.100.72:3333/uploads/${ecopoint.image}`,
      };
    });

    return response.json(serializedEcopoints);
  }

  async show(request: Request, response: Response) {
    const id = request.params.id;

    const ecopoint = await knex("ecopoints").where("id", id).first();

    if (!ecopoint) {
      return response.status(400).json({ message: "Ecopoint not found." });
    }

    const serializedEcopoint = {
      ...ecopoint,
      image_url: `http://192.168.100.72:3333/uploads/${ecopoint.image}`,
    };

    const items = await knex("items")
      .join("ecopoint_items", "items.id", "=", "ecopoint_items.item_id")
      .where("ecopoint_items.ecopoint_id", id)
      .select("items.title");

    return response.json({ ecopoint: serializedEcopoint, items });
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const trx = await knex.transaction();

    const ecopoint = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };
    const insertedIds = await trx("ecopoints").insert(ecopoint);

    const ecopoint_id = insertedIds[0];

    const pointItems = items
      .split(",")
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
        return {
          item_id,
          ecopoint_id,
        };
      });

    await trx("ecopoint_items").insert(pointItems);

    await trx.commit();

    return response.json({
      id: ecopoint_id,
      ...ecopoint,
    });
  }
}

export default EcopointController;
