import './style/index.scss'
import './lib/remFlex'
import VConsole from 'vconsole';
import Contrl from './commponet/contrl'
new Contrl()

if (ENV === 'development') {
    new VConsole();
}

