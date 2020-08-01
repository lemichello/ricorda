export default {
  apiUrl:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://ricorda-api.herokuapp.com',
  googleClientId:
    '1095009919728-drr0i1k90d7oodtffc8prrt7n6528n42.apps.googleusercontent.com',
  googleRecaptchaKey: '6Lf7D7kZAAAAAKiyZIqUSM8ixiPrmuUKp4Um4Bbm',
};
