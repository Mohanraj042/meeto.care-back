import { response } from "../helper/commonResponseHandler";
import { clientError,errorMessage } from "../helper/ErrorMessage";
import{ LanguageModel, Language } from "../model/language.model";
import axios from 'axios';

 var activity="Language";

const languages: LanguageModel[] = [
    { id: 1, code: 'en', name: 'English' },
    { id: 2, code: 'es', name: 'Spanish' },
    { id: 3, code: 'fr', name: 'French' },
    { id: 4, code: 'hi', name: 'Hindi' },
    { id: 5, code: 'ar', name: 'Arabic' },
    { id: 6, code: 'de', name: 'German' },
    { id: 7, code: 'it', name: 'Italian' },
    { id: 8, code: 'ru', name: 'Russian' },
    { id: 9, code: 'ja', name: 'Japanese' },
    { id: 10, code: 'zh', name: 'Chinese' },
    { id: 11, code: 'ko', name: 'Korean' },
    { id: 12, code: 'pt', name: 'Portuguese' },
    { id: 13, code: 'ta', name: 'Tamil' },
  ];

export let getLanguages = async (req, res, next) => {
    res.json(languages)
};

export let changeLanguage = async (req, res, next) => {
    const { code, name } = req.body;
    const userId: number = req.params.userId;
    const newLanguageCode:string=req.body.languageCode;
    const newLanguageName:string=req.body.languageName;
    const language = languages.find((language) => language.code === code);
    if (language) {
        const languageModel = new Language();
        languageModel.id = language.id;
        languageModel.code = newLanguageCode;
        languageModel.name = newLanguageName;
        const result = await Language.updateOne({ _id: userId }, languageModel);
        response(req, res, activity, 'Level-2', 'Change-Language', true, 200, result, clientError.success.registerSuccessfully);
    }
    else {
        response(req, res, activity, 'Level-3', 'Change-Language', false, 500, {}, clientError.success.registerSuccessfully);
    }
};




export const changedLanguage = async (req, res,next) => {
  try {
    const { newLanguage } = req.body; 
    const responsed = await axios.post('https://your-api-endpoint.com/change-language', {language: newLanguage,});

    if (responsed) {
      response(req, res, activity, 'Level-2', 'Change-Language', true, 200, responsed.data, clientError.success.fetchedSuccessfully);
    } else {
      response(req,res, activity, 'Level-3', 'Change-Language', false, 500, {}, errorMessage.internalServer, 'Failed to change language');
    }
  } catch (err: any) {
    response(req, res, activity, 'Level-3', 'Change-Language', false, 500, {}, errorMessage.internalServer, err.message);
  }
};
