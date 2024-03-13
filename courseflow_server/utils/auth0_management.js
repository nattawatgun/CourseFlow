import { ManagementClient } from 'auth0';

const management = new ManagementClient({
  domain: 'courseflow.us.auth0.com',
  clientId: 'XTuwEh5ghzKg2loifFEdUjA9pwX834y8',
  clientSecret: 'UEtts5a9HaEsiqyYWUlkvPQ7XSkNYvf9sZjQvvy-aQzQX3hxZGNAHCZApucyg6CG',
});

export default management;