export interface UserStats {
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
  }
  
export interface ActivityData {
    date: string;
    logins: number;
}

export interface Transaction {
    id: string;
    userId: string;
    amount: number;
    type: 'deposit' | 'withdrawal';
    status: 'pending' | 'completed';
    date: string;
}

export interface RatingDistribution {
    rating: number;
    count: number;
}
export interface Notification {
    id: string;
    message: string;
    unread: boolean;
    date: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    balance: number
}

export interface Career {
    _id: string;
    user_id: string;
    institution: string;
    position: string;
    start_year: number;
    end_year: number | null;
    created_at: number;
    updated_at: number | null;
  }
  
  export interface UserManager {
    _id: string;
    name: string;
    email: string;
    public_key: string;
    verifyToken: string;
    image: string | null;
    career_ids: string[];
    review_ids: string[];
    rating: number;
    balance: number;
    isActive: boolean;
    credit_score: number;
    created_at: number;
    updated_at: number | null;
    role?: 'admin' | 'user'; // Giả định có trường role
    careers: Career[];
  }
  
  export interface UserApiResponse {
    messsage: string;
    result: {
      result: User[];
    };
  }

  export interface TransactionBalance {
    _id: string;
    user_id: string;
    amount: number;
    type: 'credit' | 'debit';
    reason: string;
    created_at: number;
    updated_at: number | null;
  }

 export interface CareerItem {
    institution: string;
    position: string;
    start_year: string;
    end_year: string;
  }
  
 export interface FormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "user" | "manager" | "admin";
    balance: number;
    public_key: string;
    career: CareerItem[];
    submit: null | string;
  }
  