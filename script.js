const apiURL = 'https://script.google.com/macros/s/AKfycbx8WQK0QZL_amsnrK_YPso2sVUiCByw_67CFPxfdQxCCzO_I4u6pLpZH_wS4j8IxXaJFA/exec';

fetch(apiURL)
.then(response => response.json())
.then(data => {

    let rows = '';

    const serviceSet = new Set();
    const levelSet = new Set();
    const groupSet = new Set();
    const typeSet = new Set();

    data.forEach(item => {

        serviceSet.add(item['सेवा']);
        levelSet.add(item['श्रेणी/तह']);
        groupSet.add(item['समूह']);
        typeSet.add(item['खुला प्रकार']);

        rows += `
        <tr>
            <td>${item['क्र.स.'] || ''}</td>
            <td>${item['सेवा'] || ''}</td>
            <td>${item['श्रेणी/तह'] || ''}</td>
            <td>${item['समूह'] || ''}</td>
            <td>${item['उपसमूह'] || ''}</td>
            <td>
                ${
                    item['मिति']
                    ? item['मिति'].split('T')[0]
                    : ''
                }
            </td>
            <td>${item['पद'] || ''}</td>
            <td>${item['खुला प्रकार'] || ''}</td>
            <td>
                <a class="pdf-btn"
                   href="${item['फाइल']}"
                   target="_blank">

                   <i class="fa-solid fa-file-pdf"></i>
                   PDF

                </a>
            </td>
        </tr>
        `;
    });

    $('#syllabusTable tbody').html(rows);

    const table = $('#syllabusTable').DataTable({
        pageLength: 25,
        responsive: true,
        scrollX: true,
        autoWidth: false,
        language: {
            search: 'खोज्नुहोस्:',
            zeroRecords: 'डाटा भेटिएन',
            info: '_TOTAL_ मध्ये _START_ देखि _END_',
            paginate: {
                next: 'अर्को',
                previous: 'अघिल्लो'
            }
        }
    });

    function populateFilter(id, values){

        values.forEach(value => {

            if(value){

                $(id).append(
                    `<option value="${value}">${value}</option>`
                );

            }

        });

    }

    populateFilter('#serviceFilter', serviceSet);
    populateFilter('#levelFilter', levelSet);
    populateFilter('#groupFilter', groupSet);
    populateFilter('#typeFilter', typeSet);

    $('#serviceFilter').on('change', function(){
        table.column(1).search(this.value).draw();
    });

    $('#levelFilter').on('change', function(){
        table.column(2).search(this.value).draw();
    });

    $('#groupFilter').on('change', function(){
        table.column(3).search(this.value).draw();
    });

    $('#typeFilter').on('change', function(){
        table.column(7).search(this.value).draw();
    });

    $('#advancedSearch').on('keyup', function(){
        table.search(this.value).draw();
    });

    $('#resetFilters').on('click', function(){

    $('#serviceFilter').val('');
    $('#levelFilter').val('');
    $('#groupFilter').val('');
    $('#typeFilter').val('');
    $('#advancedSearch').val('');

    table.search('').columns().search('').draw();

});

})
.catch(error => {

    console.log(error);

    alert('Data loading error');

});

const darkModeBtn = document.getElementById('darkModeToggle');

if(localStorage.getItem('darkMode') === 'enabled'){
    document.body.classList.add('dark-mode');
}

darkModeBtn.addEventListener('click', () => {

    document.body.classList.toggle('dark-mode');

    if(document.body.classList.contains('dark-mode')){
        localStorage.setItem('darkMode', 'enabled');
    }else{
        localStorage.setItem('darkMode', 'disabled');
    }

});