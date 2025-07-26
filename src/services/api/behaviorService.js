import behaviorsData from "@/services/mockData/behaviors.json";

class BehaviorService {
  constructor() {
    this.behaviors = [...behaviorsData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.behaviors];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const behavior = this.behaviors.find(b => b.id === parseInt(id));
    if (!behavior) {
      throw new Error("Behavior not found");
    }
    return { ...behavior };
  }

  async create(behaviorData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newBehavior = {
      id: Math.max(...this.behaviors.map(b => b.id)) + 1,
      ...behaviorData,
      timestamp: behaviorData.timestamp || new Date().toISOString()
    };
    
    this.behaviors.push(newBehavior);
    return { ...newBehavior };
  }

  async update(id, behaviorData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.behaviors.findIndex(b => b.id === parseInt(id));
    if (index === -1) {
      throw new Error("Behavior not found");
    }
    
    this.behaviors[index] = { ...this.behaviors[index], ...behaviorData };
    return { ...this.behaviors[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.behaviors.findIndex(b => b.id === parseInt(id));
    if (index === -1) {
      throw new Error("Behavior not found");
    }
    
    const deleted = this.behaviors.splice(index, 1)[0];
    return { ...deleted };
  }
}

export default new BehaviorService();