import app from './app';
import * as dotenv from 'dotenv';
import swaggerDocs from './utils/swagger';

dotenv.config();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);

  swaggerDocs(app, PORT);
});
