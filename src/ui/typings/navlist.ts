export interface NavListData {
    links: {
        icon?: string;
        link?: string;
        name: string;
    }[]
}

export interface UIEntry {
    icon?: string;
    link?: string;
    name: string;
    componentPath: string;
}