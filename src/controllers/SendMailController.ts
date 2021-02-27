import { resolve } from "path";

import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveyUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";

import SendMailService from "../services/SendMailService";
import { AppError } from "../errors/AppError";

class SendMailController {
  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveyRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveyUsersRepository);

    const user = await usersRepository.findOne({ email });

    if (!user) throw new AppError("User does already exists");

    const survey = await surveyRepository.findOne({
      id: survey_id,
    });

    if (!survey) throw new AppError("Survey does already exists");

    const surveyAlreadyExists = await surveysUsersRepository.findOne({
      where: { user_id: user.id, value: null },
      relations: ["user", "survey"],
    });

    const ngsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: "",
      link: process.env.URL_MAIL,
    };

    if (surveyAlreadyExists) {
      variables.id = surveyAlreadyExists.id;
      await SendMailService.execute(email, survey.title, variables, ngsPath);
      return res.json(surveyAlreadyExists);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id,
    });

    await surveysUsersRepository.save(surveyUser);
    variables.id = surveyUser.id;

    await SendMailService.execute(email, survey.title, variables, ngsPath);

    return res.json(surveyUser);
  }
}

export { SendMailController };
