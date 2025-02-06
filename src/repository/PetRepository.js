import GenericRepository from "./GenericRepository.js";

export default class PetRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }
    getById = (id) => {
        return this.dao.getPetById(id);
    }
}