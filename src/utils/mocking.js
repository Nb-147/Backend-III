import { fakerES_MX as faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import PetDTO from "../dto/Pet.dto.js";
import UserDTO from "../dto/User.dto.js";
import Users from "../dao/Users.dao.js";

const speciesAndBreeds = {
    Dog: ['Labrador', 'Bulldog', 'Beagle', 'Poodle', 'German Shepherd'],
    Cat: ['Siamese', 'Persian', 'Maine Coon', 'Bengal', 'Sphynx'],
    Bird: ['Parrot', 'Canary', 'Cockatiel', 'Finch', 'Lovebird'],
    Fish: ['Goldfish', 'Betta', 'Guppy', 'Angelfish', 'Tetra']
};

const speciesImages = {
    Dog: 'https://dummyimage.com/640x480/ffcc00/000000&text=Dog',
    Cat: 'https://dummyimage.com/640x480/ff6699/000000&text=Cat',
    Bird: 'https://dummyimage.com/640x480/66ccff/000000&text=Bird',
    Fish: 'https://dummyimage.com/640x480/99cc66/000000&text=Fish'
};

export const generatePet = () => {
    const species = faker.helpers.arrayElement(Object.keys(speciesAndBreeds));
    const breed = faker.helpers.arrayElement(speciesAndBreeds[species]);
    const name = faker.person.firstName();
    const birthDate = faker.date.birthdate({ min: 0, max: 20, mode: 'age' });
    const image = speciesImages[species]; 

    return PetDTO.getPetInputFrom({
        name,
        specie: species,
        breed,
        image,
        birthDate: birthDate.toISOString().split('T')[0],
    });
};

export const generatePets = (num = 100) => {
    const pets = [];
    for (let i = 0; i < num; i++) {
        pets.push(generatePet());
    }
    return pets;
};

export const generateUsers = (num = 50) => {
    const users = [];
    const hashedPassword = bcrypt.hashSync("coder123", 10);

    for (let i = 0; i < num; i++) {
        users.push({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: hashedPassword,
            role: faker.helpers.arrayElement(["user", "admin"]),
            pets: [],
        });
    }

    return users;
};

export const insertGeneratedUsers = async (num = 50) => {
    const usersDao = new Users();
    const users = generateUsers(num);
    await usersDao.save(users);
    return users;
};