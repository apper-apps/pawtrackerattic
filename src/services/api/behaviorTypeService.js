import behaviorTypesData from "@/services/mockData/behaviorTypes.json";

class BehaviorTypeService {
  constructor() {
    this.behaviorTypes = [...behaviorTypesData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.behaviorTypes];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const type = this.behaviorTypes.find(t => t.id === parseInt(id));
    if (!type) {
      throw new Error("Behavior type not found");
    }
    return { ...type };
  }

  async create(typeData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newType = {
      id: Math.max(...this.behaviorTypes.map(t => t.id)) + 1,
      ...typeData,
      isCustom: true
    };
    
    this.behaviorTypes.push(newType);
    return { ...newType };
  }

  async update(id, typeData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.behaviorTypes.findIndex(t => t.id === parseInt(id));
    if (index === -1) {
      throw new Error("Behavior type not found");
    }
    
    this.behaviorTypes[index] = { ...this.behaviorTypes[index], ...typeData };
    return { ...this.behaviorTypes[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.behaviorTypes.findIndex(t => t.id === parseInt(id));
    if (index === -1) {
      throw new Error("Behavior type not found");
    }
    
    const deleted = this.behaviorTypes.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new BehaviorTypeService();