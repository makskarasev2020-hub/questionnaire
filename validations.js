import * as yup from 'yup';

export default {
  default: yup.string(),
  email: yup.string().label('Email').email().required(),
  phone: yup.number().label('Phone').required().min(10),
  numerical: yup.number().label('numerical').required(),
};
