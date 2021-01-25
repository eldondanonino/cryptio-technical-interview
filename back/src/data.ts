//defining a model for info extraction

type data = {
    hash160 : string
    address : string 
    n_tx : number
    total_received : number
    total_sent : number
    final_balance : 0
    txs : transaction[]

}

type transaction = 
{
    ver : number
    inputs : input[]

}

type input = {
    prev_out : {
        addr : string 
        value : number
    }
}

type output = {
    value : number 
    addr : string 

}
