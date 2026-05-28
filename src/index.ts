import cors from 'cors';
import express from 'express';
import faucetRouter from './routes/faucet';
import nftRouter from './routes/nft';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/faucet', faucetRouter);
app.use('/api/nft', nftRouter);

app.listen(port, () => {
  console.log(`Web3 API server listening on port ${port}`);
});
