


export interface ShowTime {
    _id: string;
    movie: {
      title: string;
      image: string;
      duration: number;
    };
    time: Date;
    room: {
      name: string;
      type: string;
    };
    price: number;
  }

  

  export interface Movie {
    _id: string;
    title: string;
    image: any;
    gen: string;
    duration: number;
    relseDate: string;
    description: string;
    deroctor: string;
    video:any
  }
  

  export interface Errors {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
  }