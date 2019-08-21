import { UIX } from "@naskar/nkui/dist";
import { ViewManager } from "@naskar/nkui/dist";

let ui = new UIX();
let vm = new ViewManager('.nk-app', ui);

let username = ui.field().label('Username');
let password = ui.field().label('Password').password();

let view = ui.item().add(ui.vertical()
    .add(ui.title("nkui-sample"))
    .add(username)
    .add(password)
    .add(ui.box())
    .add(ui.button().primary().text('Login').click(() => {
        
        vm.open((close) => 
            ui.vertical()
                .add(ui.text("Hello " + username.value()))
                .add(ui.button().text("Fechar").click(() => {
                    close();
                }))
        );

    })));

vm.open((close) => view);