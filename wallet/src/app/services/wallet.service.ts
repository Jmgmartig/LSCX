import { Injectable } from '@angular/core';

import * as EthWallet from 'ethereumjs-wallet'
import * as EthUtil from 'ethereumjs-util';


@Injectable()
export class WalletService {
  wallet: Array<any>;

  constructor() {
    this.wallet = new Array();
    this.getFinishW();
    
  }

  getFinishW():void{
    this.wallet = JSON.parse(localStorage.getItem('ethAcc'));
  }

  newAccount(name, pass):void {

    let wallet = EthWallet.generate();
    let acc = {
      v3 : wallet.toV3(pass),
      address :  wallet.getAddressString(),
      name : name
    }

    this.addAccount(acc);
    
  }

  importAccountJSON(name, json, pass){
    let acc:any = {}
    let error = false;
    let wallet;
    let self = this;
    try{
        wallet = EthWallet.fromV3(json,pass);
    }catch(e){
        error = true
        throw e;
    }
      if(!error){
        acc.v3 = JSON.parse(json);
        acc.address = wallet.getAddressString();
        acc.name = name;
        self.addAccount(acc);
      }
  }

  importAccountPrivate(name, privateKey,  pass):void{
    let acc:any = {}
    let wallet;
    let error = false;
    try{
      wallet = new EthWallet( EthUtil.toBuffer(privateKey));

    }catch(e){
      error = true;
      throw e;
    }
    if(!error){      
        acc.v3 = wallet.toV3(pass);
        acc.address =  wallet.getAddressString();
        acc.name = name;
        this.addAccount(acc);
    }
    
  }
  
  
  addAccount(acc):void{
    if(!localStorage.getItem('ethAcc')){
      let acca= new Array();
      acca[0]=acc;
      localStorage.setItem('ethAcc',JSON.stringify(acca));
  
    }else{
      let  acca= JSON.parse(localStorage.getItem('ethAcc'));
      acca.push(acc);
      localStorage.setItem('ethAcc',JSON.stringify(acca));
    }
    
    this.getFinishW();//To refresh wallet
  }

  delete(addr):void{
    let index = this.wallet.findIndex(x => x.address === addr);
    //console.log(index);
    if(index > -1){
      this.wallet.splice(index,1);
      localStorage.setItem('ethAcc',JSON.stringify(this.wallet));
      this.getFinishW(); //To refresh wallet
    }
  }

  getAccount(addr): any{

    let acc = this.wallet.find(x => (x.address).toLowerCase() === addr.toLowerCase());
    return acc;
  }


}