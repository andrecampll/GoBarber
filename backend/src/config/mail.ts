interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'andrevictor50@gmail.com', // configured email from ses
      name: 'André da Rocketseat',
    },
  },
} as IMailConfig;
