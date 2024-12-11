import { fakerES_MX as faker } from "@faker-js/faker";
import PetDTO from "../dto/Pet.dto.js";

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
