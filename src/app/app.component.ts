import { Component } from '@angular/core';
import {FormControl, NgForm, FormGroup} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import { WordSearch, ReturnedCount } from 'src/app/common/models/word-search';
import axios from 'axios';

const notSearched: WordSearch = {
  phrase: '',
  word: '',
  completeWord: true,
  caseSensitive: true
}

const notCounted: ReturnedCount = {
  count: null
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Find Words'; //this is header on browser tab

  constructor() { }

  ngOnInit(): void {
  }

  searchedWord = notSearched; //default values for search object

  counted = notCounted; //null value for count

  searchWord(searchedWord: any) {
    this.searchedWord = searchedWord;
      axios.get("http://localhost:2999/wordSearch", {params: this.searchedWord}) //replace "localhost" with deployed public IP in deployment
        .then(result => {
          this.counted.count = result.data;
        })
        .catch(err => console.log('error in app.component.ts get', err));
  }

}
