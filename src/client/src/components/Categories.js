import axios from 'axios';

const Categories = async () => {
    const res = await axios.get('http://localhost:3000/categories/getAll');

    console.log(res)
}

export default Categories;