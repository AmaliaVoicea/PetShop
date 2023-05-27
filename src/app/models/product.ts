export class Product{
  public price: number;
  public id: number;
  public description: string;
  public instructions: string;
  public category: string;
  public animal: Date;
  public image_url: string;
  public product_type: string;

  constructor(init: Partial<Product>) {
      Object.assign(this, init);
  }
}
