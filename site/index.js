const js = import("../pkg/hello_wasm.js");

js.then(js=>{
    const {Universe} = js;
    const pre = document.getElementById("game-of-life-canvas");

    const universe = Universe.new();

    const renderLoop = () => {
        pre.textContent = universe.render();
        universe.tick();

        requestAnimationFrame(renderLoop);
    };

    requestAnimationFrame(renderLoop);
});

