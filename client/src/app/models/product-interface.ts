export interface ProductInterface{
    id?: string;
    code?: string;
    category?: string;
    name?: string;
    size?: string;
    description?: string;
    applications?: string;
    price?: number;
    units?: number;
    image?: string;
    imagePath?: string;
    available?: boolean;
    boxCapacity?: number;
    boxes?: any;
    singleUnits?: number;
    bestSeller?: boolean;
}

export interface ProductProdInterface{
    id?: string;
    code?: string;
    category?: string;
    name?: string;
    size?: string;
    description?: string;
    applications?: string;
    price?: number;
    units?: number;
    image?: string;
    available?: boolean;
    boxCapacity?: number;
    bestSeller?: boolean;
}