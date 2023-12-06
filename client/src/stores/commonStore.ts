import { makeAutoObservable } from "mobx";
import { ServerError } from "../models/serverError";
import { IUser } from "../models/user";

export default class CommonStore {
    error: ServerError | null = null;
    isShow: boolean = false
    imgUrl: string | undefined
    open: boolean = false
    cuocGoiTuUser: IUser | null = null
    openCuocGoiDen = false
    openCuocGoiDi = false
    clearIntervalTime = false
    isScrollToBottom = false

    constructor() {
        makeAutoObservable(this);
    }


    setIsScrollToBottom = (data: boolean)=>{
        this.isScrollToBottom = data
    }
    
    setClearIntervalTime = (val: boolean) => {
        this.clearIntervalTime = val
    }

    setServerError = (error: ServerError) => {
        this.error = error;
    }

    showImageViewer = (value: boolean)=>{
        this.isShow = value
    }

    setImgUrl = (imgUrl: string)=>{
        this.imgUrl = imgUrl
    }

    setOpenDialog = (val : boolean)=>{
        this.open = val
    }

    setGoiTuUser = (data : IUser)=>{
        this.cuocGoiTuUser = data
    }

    setOpenCuocGoiDen = (val: boolean)=>{
        this.openCuocGoiDen = val
    }

    setOpenCuocGoiDi = (val: boolean)=>{
        this.openCuocGoiDi = val
    }

    get IsCuocGoiDen(){
        return this.openCuocGoiDen
    }

    get IsCuocGoiDi(){
        return this.openCuocGoiDi
    }    
}