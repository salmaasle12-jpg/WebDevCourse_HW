let txt1, txt2, btn, lblRes, op, output;

window.onload = function () {
    txt1 = document.getElementById("txt1");
    txt2 = document.getElementById("txt2");
    btn = document.getElementById("btnCalc");
    lblRes = document.getElementById("lblRes");
    op = document.getElementById("op");
    output = document.getElementById("output");

    txt1.addEventListener("input", () => validate(txt1));
    txt2.addEventListener("input", () => validate(txt2));

    btn.addEventListener("click", calculate);
};

function validate(box) {
    const v = box.value.trim();

    if (v !== "" && !isNaN(v)) {
        box.classList.remove("is-invalid");
        box.classList.add("is-valid");
        return true;
    } else {
        box.classList.remove("is-valid");
        box.classList.add("is-invalid");
        return false;
    }
}

function calculate() {
    if (!validate(txt1) || !validate(txt2)) {
        lblRes.innerText = "error:invalid input";
        return;
    }

    let a = parseFloat(txt1.value);
    let b = parseFloat(txt2.value);
    let operation = op.value;

    let result;

    switch (operation) {
        case "+": result = a + b; break;
        case "-": result = a - b; break;
        case "*": result = a * b; break;
        case "/": result = b == 0 ? "not divided on 0" : a / b; break;
    }

    lblRes.innerText = result;

    print(`${a} ${operation} ${b} = ${result}`, true);
}

function print(msg, append) {
    if (!append) {
        output.value = msg;
    } else {
        output.value += "\n" + msg;
    }
}
