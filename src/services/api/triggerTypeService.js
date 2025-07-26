import triggerTypesData from "@/services/mockData/triggerTypes.json";

class TriggerTypeService {
  constructor() {
    this.triggerTypes = [...triggerTypesData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.triggerTypes];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const trigger = this.triggerTypes.find(t => t.id === parseInt(id));
    if (!trigger) {
      throw new Error("Trigger type not found");
    }
    return { ...trigger };
  }

  async create(triggerData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newTrigger = {
      id: Math.max(...this.triggerTypes.map(t => t.id)) + 1,
      ...triggerData,
      isCustom: true
    };
    
    this.triggerTypes.push(newTrigger);
    return { ...newTrigger };
  }

  async update(id, triggerData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.triggerTypes.findIndex(t => t.id === parseInt(id));
    if (index === -1) {
      throw new Error("Trigger type not found");
    }
    
    this.triggerTypes[index] = { ...this.triggerTypes[index], ...triggerData };
    return { ...this.triggerTypes[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.triggerTypes.findIndex(t => t.id === parseInt(id));
    if (index === -1) {
      throw new Error("Trigger type not found");
    }
    
    const deleted = this.triggerTypes.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new TriggerTypeService();