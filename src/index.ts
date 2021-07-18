import {ask, askSync} from './asked';

/*for(let i=0;i<3;i++){
	ask("swim0413","async test")
}*/
for(let j=0;j<100;j++){
	askSync("swim0413","sync test")
}