import express from 'express';
import { 
  getAll, 
  getOneById, 
  create, 
  updateById, 
  deleteById 
} from './controllers/planets';

const app = express();
app.use(express.json());


app.get('/api/planets', getAll);

app.get('/api/planets/:id', getOneById);

app.post('/api/planets', create);

app.put('/api/planets/:id', updateById);

app.delete('/api/planets/:id', deleteById);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});