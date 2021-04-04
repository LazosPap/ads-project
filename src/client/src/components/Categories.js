import axios from 'axios';

const Categories = async () => {
    const res = await axios.get('localhost:3000/categories');

    console.log(res)
}

export default Categories;