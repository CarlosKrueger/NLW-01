import express from "express";
import { celebrate, Joi } from "celebrate";
import multer from "multer";
import multerConfig from "./config/multer";

import EcopointController from "./controllers/EcopointController";
import ItemsController from "./controllers/ItemsController";

const routes = express.Router();
const upload = multer(multerConfig);
const ecopointController = new EcopointController();
const itemsController = new ItemsController();

routes.get("/items", itemsController.index);
routes.get("/ecopoints", ecopointController.index);
routes.get("/ecopoints/:id", ecopointController.show);

routes.post(
  "/ecopoints",
  upload.single("image"),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.number().required(),
        uf: Joi.number().required().max(2),
        items: Joi.string().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  ecopointController.create
);

export default routes;
