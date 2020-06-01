import { LightningElement } from 'lwc';
import waterFallContentAsset from '@salesforce/contentAssetUrl/waterfall';

export default class VideoPlayer extends LightningElement {

    waterfallVideoUrl = waterFallContentAsset;

}