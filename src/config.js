export default {
  apiUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://ricorda-api-stage.herokuapp.com'
};
