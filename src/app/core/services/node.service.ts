import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class NodeService {

    constructor(private http: HttpClient) { }

    getFiles() {
        return this.http.get<any>('assets/demo/data/files.json')
            .toPromise()
            .then(res => res.data as TreeNode[]);
    }

    getLazyFiles() {
        return this.http.get<any>('assets/demo/data/files-lazy.json')
            .toPromise()
            .then(res => res.data as TreeNode[]);
    }

    getFilesystem() {
        return this.http.get<any>('assets/demo/data/filesystem.json')
            .toPromise()
            .then(res => res.data as TreeNode[]);
    }

    getLazyFilesystem() {
        return this.http.get<any>('assets/demo/data/filesystem-lazy.json')
            .toPromise()
            .then(res => res.data as TreeNode[]);
    }
}
